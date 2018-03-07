# Lingohub Client

We use LingoHub for translation management. LingoHub separates keys and translations strictly, 
therefore we also implement this behaviour in our workflows.
The translation format uses the [Format.js](https://formatjs.io/guides/message-syntax/) syntax.



## Get current translations

Run

    lingohub-client d --account LINGOHUB_ACCOUNT --project LINGOHUB_PROJECT --token LINGOHUB_TOKEN -d DIRECTORY_WITH_LANGUAGE_FILES

Pay attention; this will overwrite all local translation files with the current LingoHub
version.



## Upload edited translations

When changing translations, the change needs to be propagated back to LingoHub.
In LingoHub a translation is added from a base translation file (e.g. en.json). 
A key will never be deactivated nor deleted, but only added or changed.
After changing (adding, updating) the base translation file, run 

    lingohub-client u --account LINGOHUB_ACCOUNT --project LINGOHUB_PROJECT --token LINGOHUB_TOKEN --fileName BASE_LANGUAGE_FILE -d DIRECTORY_WITH_LANGUAGE_FILES



## A typical translation workflow

You build a feature which needs additional translations. 
Typically you add a key to the base translation (e.g en.json) file and add meaningful content to it.
Let's connect this to LingoHub:

1. Before changing the base translation file: Get current translations (download latest translations from LingoHub)
2. Check if your key is already there, if not continue to Step 4, else
3. If you have anything to change, change the content of the key
4. Add the key and add a content to the base translation file
5. Upload edited translations
6. Be happy. Translators will now be able to see your changes and translate whatever you added.


