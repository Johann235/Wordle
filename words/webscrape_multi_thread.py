from concurrent.futures import ThreadPoolExecutor
from threading import Lock
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import time
import re

NUM_THREADS = 10
WORD_LEN = 5

OUTPUT_FILE = Path(__file__).parent / "word_list.txt"
f = open("word_list.txt", "w")
letters = [chr(i) for i in range(ord('a'), ord('z') + 1)]
hashset = set()
lengths = {}
mutex = Lock()

##Assign letters to each thread
def get_indeces(num_threads):
    indecies = []
    curr_index = 26
    per_list = 26 // num_threads
    ##Threads that have to do extra work 
    extra = 26 % num_threads

    ##Go backwards so threads with more letters start at end of alphabet
    for i in range (num_threads):
        end = curr_index
        curr_index -= per_list
        if i < extra:
            curr_index -= 1
        start = curr_index
        indecies.append((start,end))
    return indecies

def countWords(words,file):
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

            file.write(child.text + "\n")
            file.flush()
    mutex.release()

def addWords(words,file,length):
    mutex.acquire()
    for word in words:
        for child in word.children:
            ##Duplicate word or wrong length
            if child.text in hashset or len(child.text) != length:
                continue

            ##Special char
            pattern = "[^a-zA-Z]"
            if re.search(pattern,child.text) != None:
                continue

            hashset.add(child.text)
            print(child.text)
            file.write(child.text + "\n")
            file.flush()
    mutex.release()

def worker(letters):
    for letter in letters:
        ##Get the page for each letter
        url = f"https://tagalog.pinoydictionary.com/list/{letter}/"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        ##Add words to txt
        words = soup.find_all("h2", class_="word-entry")
        addWords(words,f,WORD_LEN)

        ##Tag for last page of letter
        last_page = soup.find("a", title="Last Page")
        ##If there is only one page
        if last_page == None:
            continue

        last_page = str(last_page)

        ##Find start of last page number (cut off before the page nunmber)
        index = last_page.find(f"list/{letter}/")
        last_page = last_page[index+len(f"list/{letter}/"):]    

        ##Cut off the rest of the string to get last page number
        index = last_page.find("/")
        last_page = last_page[:index]
        
        ##Loop though all page numbers for given letter
        for i in range(2, int(last_page) + 2):
            url = f"https://tagalog.pinoydictionary.com/list/{letter}/{i}/"
            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            words = soup.find_all("h2", class_="word-entry")
            addWords(words,f, WORD_LEN)


start = time.time()
with ThreadPoolExecutor(max_workers=NUM_THREADS) as executor:
    split = get_indeces(NUM_THREADS)
    for start,end in split:
        print(start,end)
        executor.submit(worker, letters[start:end])
end = time.time()

f.write(str(len) + "\n")
f.write(str(end - start))
f.flush()
print(str(end-start))
f.close()