import threading
from functools import reduce
import requests
import time 


def func(number):
    url = 'http://example.com/'
    for i in range(number):
        response = requests.get(url)
        with open('example.com.txt', 'w') as output:
            output.write(response.text)

thread_requests = []
for i in range(50):
    thread_requests.append(i)

print(thread_requests)

    
threads = []
THREAD_CAP = 10

def threader(reqs):
    thread = threading.Thread(target=func, args=(reqs,))
    threads.append(thread)
    thread.start()

while thread_requests:
    if len(threads) < THREAD_CAP:
        threader(thread_requests[0])
        thread_requests.pop(0)
    if len(threads)>1:
        for thread in threads:
            if not (thread.is_alive()):
                thread.join()
                threads.remove(thread)
                

    print(thread_requests)

print("REQUESTS COMPLETE")





