import re

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
    return f'<a {className} tabindex="0" target="_blank" href="{link}">{text}</a>'


def createText(counter, first_number, title_link, title_text, dplus_link):
    amountSpaces = createAmountSpaces(counter)

    if counter < 3:
        nums = f'{counter:<{amountSpaces}}   {first_number}'
    elif counter == 3:
        nums = f'         T     '
    else:
        counterAfterMovie = counter - 1
        nums = f'{counterAfterMovie:<{amountSpaces}}   {first_number}'
    
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
    for line in file:
        match = re.search(pattern, line)
        if match:
            first_number = match.group(1)
            title = match.group(2)
            title_link = match.group(3)
            dplus_link = match.group(4)
            
            first_number = f"{first_number[0]}-{first_number[1:]}"
            text = createText(counter, first_number, title_link, title, dplus_link)

            with open("output.txt", "a") as out:
                print(f'    {{ id: {counter}, text: {text}, completed: false }},', file=out)
            counter += 1
