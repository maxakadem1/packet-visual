import pcapng
import json, sys, os
from ipaddress import ip_address
from urllib.request import Request, urlopen, HTTPError
from scapy.layers.l2 import Ether
from scapy.layers.inet import IP
from time import sleep

# dependencies
# =======================
# pip install scapy
# pip install ipaddress
# pip install python-pcapng
#
# everything else should be installed by default

# main driver function that parses the file and creates the json file
# returns the json filename
def parse_pcapng_file(filename):
    ip_locations = {}
    reserved_addresses = []
    print(f"Parsing {filename}")
    output = {}
    current_id = 0
    for block in pcapng.FileScanner( open( filename, 'rb' ) ):
        if isinstance( block, pcapng.blocks.EnhancedPacket ):
            payload = Ether(block.packet_data).payload

            # ensure data is an IP protocol packet, and part of the publically accessible internet
            if (isinstance( payload, IP ) and 
            ip_address(payload.src).is_global and ip_address(payload.dst).is_global and
            not ip_address(payload.src).is_multicast and not ip_address(payload.dst).is_multicast ):

                # check source IP 
                if payload.src not in ip_locations.keys():
                    src_data = check_geoloc(payload.src, ip_locations, reserved_addresses)
                else:
                    src_data = ip_locations[payload.src]

                # check destination IP
                if payload.dst not in ip_locations.keys():
                    dst_data = check_geoloc(payload.dst, ip_locations, reserved_addresses)
                else:
                    dst_data = ip_locations[payload.dst]


                # if no data returned (API timeout), skip the whole entry
                if len(dst_data.keys()) <= 0 or len(src_data.keys()) <= 0:
                    pass
                
                else:
                    # print(block.timestamp)
                    # print(str(type(payload.payload)).split(".")[-1].strip("'>"))
                    # print(f"{payload.src} > {payload.dst}")
                    # print(f"Source - Lat: {src_data['latitude']} Long: {src_data['longitude']}")
                    # print(f"Destination - Lat: {dst_data['latitude']} Long: {dst_data['longitude']}")

                    output[current_id] = {
                        'timestamp': str(block.timestamp),
                        'protocol': str(type(payload.payload)).split(".")[-1].strip("'>"),
                        'source_ip': payload.src,
                        'destination_ip': payload.dst,
                        'source_location': {
                            'latitude': src_data['latitude'],
                            'longitude': src_data['longitude']
                        },
                        'destination_location': {
                            'latitude': dst_data['latitude'],
                            'longitude': dst_data['longitude']
                        }
                    }
                    current_id += 1

    with open(filename.replace('.pcapng', '.json'), 'w') as outfile:
        json.dump(output, outfile)
        print(f"Completed parsing on {filename}")
        return 'public/data/' + filename.replace('.pcapng', '.json')


# helper function to get geolocations from IP addresses
# takes in a list of previously known IP addresses, and addresses that are known to be reserved
def check_geoloc(ip_addr, ip_locations, reserved_addresses):
    data = get_geoloc(ip_addr)

    if 'latitude' in data.keys() and 'longitude' in data.keys():
        ip_locations[ip_addr] = {
            'latitude': data['latitude'],
            'longitude': data['longitude']
        }
    
    else:
        data = {}

        if 'reserved' in data.keys():
            reserved_addresses.append(ip_addr)
    
    return data


# helper function to get the geolocation from a specific IP address
# returns a dictionary object containing the data returned from the API
def get_geoloc(ip_addr):
    data = {}
    attempts = 0
    while 'latitude' not in data.keys() and 'longitude' not in data.keys() and attempts < 10:
        try:
            file = urlopen(Request(f"https://ipapi.co/{ip_addr}/json/", headers={'User-Agent': 'Mozilla/5.0'}))
            data = json.loads(file.read().decode())
            file.close()
        except HTTPError as e:
            if e.code == 429:
                print("Rate Limit Exceeded, trying again in 5 seconds...")
                sleep(5)
            else:
                sleep(1)
        attempts += 1


        if 'error' in data.keys() and 'reserved' in data['reason'].lower():
            print(f"Reserved {ip_addr}")
            data = {'reserved': True}
            break

        elif 'error' in data.keys():
            print("Error")
            print(data)

        elif 'latitude' not in data.keys() and 'longitude' not in data.keys():
            data = {}
            sleep(0.2)

    return data


if __name__ == '__main__':
    if len(sys.argv) == 1:
        print("Error: No file arguements specified.")
        quit()

    for arg in sys.argv[1:]:
        try:
            parse_pcapng_file(arg)
        except:
            print(f"Unable to parse file: {arg}")