import os

import matplotlib.pyplot as plt
import geopandas as gpd

coastlines_path = os.path.join("data", "ne_10m_coastline", "ne_10m_coastline.shp")
ports_path = os.path.join("data", "ne_10m_ports", "ne_10m_ports.shp")
countries_path = os.path.join(
    "data", "ne_10m_admin_0_countries", "ne_10m_admin_0_countries.shp"
)

ports = gpd.read_file(ports_path)
coastlines = gpd.read_file(coastlines_path)
countries = gpd.read_file(countries_path)

def get_country_with_name(country_name):
    return countries[countries["SOVEREIGNT"] == country_name]

def get_ports_in_a_country(country_name):
    selected_country_gdf = get_country_with_name(country_name)
    if not selected_country_gdf.empty:
        selected_country_gdf = selected_country_gdf.to_crs(epsg=3763)
        ports_gdf = ports.to_crs(epsg=3763)

        ports_within_country = ports_gdf.dwithin(
            selected_country_gdf.iloc[0].geometry, 1000
        )

        return ports_gdf[ports_within_country]
    else:
        return None

def list_ports_in_a_country(): 
    country_name = input("\n\nEnter country name: ")
    print("Searching for ports in {}...".format(country_name))

    ports_within_country = get_ports_in_a_country(country_name)

    if ports_within_country is not None:
        counter = 1
        for port in ports_within_country["name"].values: 
            print("{}. {}".format(counter, port))
            counter += 1
    else:
        print("Country not found in database. Auto suggestions coming soon.")

def show_ports_in_a_country():
    country_name = input("\n\nEnter country name: ")
    print("Searching for ports in {}...".format(country_name))

    ports_within_country = get_ports_in_a_country(country_name)
    country = get_country_with_name(country_name)

    fig, ax1 = plt.subplots(figsize=(18.5, 10.5))
    countries.plot(ax=ax1)
    # ports_within_country.plot(ax=ax1)

    plt.show()
    # fig.clear()
    pass

while True:
    print("\n\nThings you can do:")
    print("1. List ports in a country (by name)")
    print("2. Show ports of a country (by name) on a map")
    print("n. Exit")
    inp = input("Enter operation number: ")

    if inp == "1":
        list_ports_in_a_country()
    elif inp == "2":
        show_ports_in_a_country()
    elif inp == "n":
        break

# # coastlines.plot(ax=ax1)
# ports.plot(ax=ax1)
# countries.plot(ax=ax1)

# ax1.set(title="Countries Boundaries with Ports")
# plt.show()
