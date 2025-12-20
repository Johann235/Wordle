from concurrent.futures import ThreadPoolExecutor
from threading import Lock
import requests
from bs4 import BeautifulSoup
import time

NUM_THREADS = 10

f = open("words2.txt", "w")
letters = [chr(i) for i in range(ord('a'), ord('z') + 1)]
hashset = set()
lengths = {}
mutex = Lock()

def get_indeces(num_threads):
    indecies = []
    curr_index = 26
    per_list = 26 // num_threads
    extra = 26 % num_threads

    for i in range (num_threads):
        end = curr_index
        curr_index -= per_list
        if i < extra:
            curr_index -= 1
        start = curr_index
        indecies.append((start,end))
    return indecies

def addWords(words,f):
    mutex.acquire()
    for word in words:
        for child in word.children:
            if child.text in hashset:
                continue
            hashset.add(child.text)
            print(child.text)
            word_length = len(child.text)

            if(word_length not in lengths):
                lengths[word_length] = 0
            lengths[word_length] += 1

            f.write(child.text + "\n")
            f.flush()
    mutex.release()

def worker(letters):
    for letter in letters:
        ##Get the page for each letter
        url = f"https://tagalog.pinoydictionary.com/list/{letter}/"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        ##Add words to txt
        words = soup.find_all("h2", class_="word-entry")
        addWords(words,f)

        ##Tag for last page of letter
        last_page = soup.find_all("a", title="Last Page")
        ##If there is only one page
        if last_page == []:
            continue

        last_page = str(last_page[0])

        ##Find start of last page number
        index = last_page.find(f"list/{letter}/")
        last_page = last_page[index+len(f"list/{letter}/"):]    

        ##Cuttof the rest of the string to get last page number
        index = last_page.find("/")
        last_page = last_page[:index]
        
        ##Loop though all page numbers for given letter
        for i in range(2, int(last_page) + 2):
            url = f"https://tagalog.pinoydictionary.com/list/{letter}/{i}/"
            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            words = soup.find_all("h2", class_="word-entry")
            addWords(words,f)


# Create a thread pool with 2 workers
start = time.time()
with ThreadPoolExecutor(max_workers=10) as executor:
    # Submit two tasks to run in parallel
    split = get_indeces(NUM_THREADS)
    for start,end in split:
        #print(start,end)
        executor.submit(worker, letters[start:end])
end = time.time()

f.write(str(len) + "\n")
f.write(str(end - start))
f.flush()
print(str(end-start))
f.close()