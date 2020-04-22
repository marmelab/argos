curl -sSL --unix-socket /var/run/docker.sock "http:/v1.37/containers/json"

curl -sSL --unix-socket /var/run/docker.sock "http:/v1.37/containers/json?&before=8dfafdbc3a40&size=1"

curl -v --unix-socket /var/run/docker.sock http://localhost/containers/argos_cypress_1/stats

gives:

{
"read": "2020-02-19T14:42:05.114922572Z",
"preread": "0001-01-01T00:00:00Z",
"pids_stats": {
"current": 411
},
"blkio_stats": {
"io_service_bytes_recursive": [
{
"major": 8,
"minor": 0,
"op": "Read",
"value": 97468416
},
{
"major": 8,
"minor": 0,
"op": "Write",
"value": 110018560
},
{
"major": 8,
"minor": 0,
"op": "Sync",
"value": 116039680
},
{
"major": 8,
"minor": 0,
"op": "Async",
"value": 91447296
},
{
"major": 8,
"minor": 0,
"op": "Discard",
"value": 0
},
{
"major": 8,
"minor": 0,
"op": "Total",
"value": 207486976
},
{
"major": 253,
"minor": 0,
"op": "Read",
"value": 97468416
},
{
"major": 253,
"minor": 0,
"op": "Write",
"value": 110018560
},
{
"major": 253,
"minor": 0,
"op": "Sync",
"value": 116039680
},
{
"major": 253,
"minor": 0,
"op": "Async",
"value": 91447296
},
{
"major": 253,
"minor": 0,
"op": "Discard",
"value": 0
},
{
"major": 253,
"minor": 0,
"op": "Total",
"value": 207486976
}
],
"io_serviced_recursive": [
{
"major": 8,
"minor": 0,
"op": "Read",
"value": 2567
},
{
"major": 8,
"minor": 0,
"op": "Write",
"value": 2387
},
{
"major": 8,
"minor": 0,
"op": "Sync",
"value": 4783
},
{
"major": 8,
"minor": 0,
"op": "Async",
"value": 171
},
{
"major": 8,
"minor": 0,
"op": "Discard",
"value": 0
},
{
"major": 8,
"minor": 0,
"op": "Total",
"value": 4954
},
{
"major": 253,
"minor": 0,
"op": "Read",
"value": 2567
},
{
"major": 253,
"minor": 0,
"op": "Write",
"value": 2387
},
{
"major": 253,
"minor": 0,
"op": "Sync",
"value": 4783
},
{
"major": 253,
"minor": 0,
"op": "Async",
"value": 171
},
{
"major": 253,
"minor": 0,
"op": "Discard",
"value": 0
},
{
"major": 253,
"minor": 0,
"op": "Total",
"value": 4954
}
],
"io_queue_recursive": [],
"io_service_time_recursive": [],
"io_wait_time_recursive": [],
"io_merged_recursive": [],
"io_time_recursive": [],
"sectors_recursive": []
},
"num_procs": 0,
"storage_stats": {},
"cpu_stats": {
"cpu_usage": {
"total_usage": 861318907649,
"percpu_usage": [
66670802582,
60018508505,
70559732085,
75746162956,
69881564539,
80308102107,
68519844629,
72656358684,
75121304628,
68404881542,
77140070520,
76291574872
],
"usage_in_kernelmode": 117500000000,
"usage_in_usermode": 680600000000
},
"system_cpu_usage": 324388430000000,
"online_cpus": 12,
"throttling_data": {
"periods": 0,
"throttled_periods": 0,
"throttled_time": 0
}
},
"precpu_stats": {
"cpu_usage": {
"total_usage": 0,
"usage_in_kernelmode": 0,
"usage_in_usermode": 0
},
"throttling_data": {
"periods": 0,
"throttled_periods": 0,
"throttled_time": 0
}
},
"memory_stats": {
"usage": 1525182464,
"max_usage": 1560825856,
"stats": {
"active_anon": 874303488,
"active_file": 82014208,
"cache": 308600832,
"dirty": 0,
"hierarchical_memory_limit": 9223372036854772000,
"hierarchical_memsw_limit": 0,
"inactive_anon": 399962112,
"inactive_file": 85143552,
"mapped_file": 207618048,
"pgfault": 5383950,
"pgmajfault": 957,
"pgpgin": 5113647,
"pgpgout": 4761403,
"rss": 1134059520,
"rss_huge": 0,
"total_active_anon": 874622976,
"total_active_file": 82542592,
"total_cache": 307900416,
"total_dirty": 0,
"total_inactive_anon": 399323136,
"total_inactive_file": 85524480,
"total_mapped_file": 207003648,
"total_pgfault": 5383995,
"total_pgmajfault": 1122,
"total_pgpgin": 5113836,
"total_pgpgout": 4761412,
"total_rss": 1133899776,
"total_rss_huge": 0,
"total_unevictable": 0,
"total_writeback": 0,
"unevictable": 0,
"writeback": 0
},
"limit": 16628068352
},
"name": "/argos_cypress_1",
"id": "46ae251813fb6ac92f31449f7e44957508e84c18e92751d55aba73a871615c7e",
"networks": {
"eth0": {
"rx_bytes": 52216294,
"rx_packets": 23060,
"rx_errors": 0,
"rx_dropped": 0,
"tx_bytes": 2823196,
"tx_packets": 21881,
"tx_errors": 0,
"tx_dropped": 0
}
}
}
