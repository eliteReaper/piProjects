import csv

devices = []
speed_metrics = []
metrics_to_log = ['download']
with open('connected_devices', 'r') as connected_devices_file: 
    for line in connected_devices_file:
        information = line.split(' ')
        ip =  information[1]
        mac = information[3]
        connected_by = information[-1]
        devices.append({'ip': ip, 'mac': mac, 'connected_by': connected_by})

with open('current_speed.csv', 'r') as current_speed_file:
    csv_reader = csv.DictReader(current_speed_file)
    for row in csv_reader:
        metrics = []
        for metric in metrics_to_log:
            metrics.append(float(row[metric]) * 0.000008)
        speed_metrics.append(metrics)
        
with open('log.txt', 'a') as output:
    line_to_write = ''
    for device in devices:
       line_to_write += device['ip']
    line_to_write += ', '
    for metrics in speed_metrics:
        for metric in metrics:
            line_to_write += (str(metric) + ' MBps')
    line_to_write += '\n'
    output.write(line_to_write)
    