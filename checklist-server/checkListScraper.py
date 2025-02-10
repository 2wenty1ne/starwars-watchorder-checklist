import re
import os
import csv

pattern = r"(\d+) \[([^\]]+)\]\((https:\/\/[^)]+)\) \\\| \[Stream on Disney\+(?:  <br>)?\]\((https:\/\/[^)]+)\)" 

def createAmountSpaces(counter):
    buffer = 0
    amountNums = len(str(counter-1))
    if amountNums == 1:
        return 5 + buffer
    elif amountNums == 2:
        return 4 + buffer
    elif amountNums == 3:
        return 2 + buffer


def createA(link, text):
    className = 'class="a"'
    return f'<a {className} tabindex="0" href="{link}">{text}</a>'


def createText(counter, epCount, title_link, title_text, dplus_link):
    amountSpaces = createAmountSpaces(counter)

    if counter < 3:
        nums = f'{counter:<{amountSpaces}}   {epCount}'
    elif counter == 3:
        nums = f'         T     '
    else:
        counterAfterMovie = counter - 1
        nums = f'{counterAfterMovie:<{amountSpaces}}   {epCount}'
    
    if counter == 3:
        title_link = "https://www.disneyplus.com/movies/star-wars-the-clone-wars/AVmv1ulT1nQW?cid=DTCI-Synergy-StarWars-Site-Aquisition-USLaunch-US-StarWars-StarWarsTheCloneWars-EN-NavPipe-StartStreamingNow-NA"
        dplus_link = "https://www.disneyplus.com/movies/star-wars-the-clone-wars/AVmv1ulT1nQW?cid=DTCI-Synergy-DDN-Site-Acquisition-StarWars-US-StarWars-StarWarsTheCloneWars-EN-BlogArticleEmbed-TCWChronological_StreamOnDisneyPlusCTA-NA"
        title = createA(title_link, title_text)
        dplus = createA(dplus_link, "Disney+ Stream")
        return f"'{nums}   {title} | {dplus}'"

    title = createA(title_link, title_text)
    dplus = createA(dplus_link, "Disney+ Stream")
    return f"'{nums}   {title} | {dplus}'"


counter = 1
with open("checkListInput.txt", "r") as file:
    data = []
    for line in file:
        match = re.search(pattern, line)
        if match:
            epCount = match.group(1)
            title = match.group(2)
            title_link = match.group(3)
            dplus_link = match.group(4)

            if counter == 3:
                movie_title_link = "https://www.disneyplus.com/movies/star-wars-the-clone-wars/AVmv1ulT1nQW?cid=DTCI-Synergy-StarWars-Site-Aquisition-USLaunch-US-StarWars-StarWarsTheCloneWars-EN-NavPipe-StartStreamingNow-NA"
                movie_dplus_link = "https://www.disneyplus.com/movies/star-wars-the-clone-wars/AVmv1ulT1nQW?cid=DTCI-Synergy-DDN-Site-Acquisition-StarWars-US-StarWars-StarWarsTheCloneWars-EN-BlogArticleEmbed-TCWChronological_StreamOnDisneyPlusCTA-NA"
                movie_title = "Clone Wars Movie"
                movie_row = ["", "T", movie_title_link, movie_title, movie_dplus_link]
                data.append(movie_row)
                counter += 1

            epCount = f"{epCount[0]}-{epCount[1:]}"

            displayCount = counter

            if counter > 3:
                displayCount -= 1

            row = [displayCount, epCount, title_link, title, dplus_link]
            data.append(row)

            # text = createText(counter, epCount, title_link, title, dplus_link)
            # with open("output.txt", "a") as out:
            #     print(f'    {{ id: {counter}, text: {text}, completed: false }},', file=out)
            counter += 1

    with open("episodes.csv", "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerows(data)

    with open("episodes.csv", "r+") as file:
        file.seek(0, 2)
        file.seek(file.tell() - len(os.linesep), 0)
        file.truncate()
