

This repository contains oTree code that implements the ideation task developed by Laske, Schröder & Römer (2023). It includes the experiment (app: Ideation), as well as an app to collect data on guessing the illustrated word in order to determine the quality (app: Rater). For the Rater app you need to upload a file containing the position of the elements of the illustrations (as saved in the Ideation app), a unique id for each illustration (photoid) and the illustrated word. The repository conains an example file (example_rater_upload.csv). The repository further contains a dictionary that is based on the Meriam Webster dictionary (see https://www.merriam-webster.com/apps), removing all compound words. Required python tools and oTree version are listed in the requirements.txt. It further uses selecto (https://github.com/daybrush/selecto) and moveable (https://github.com/daybrush/moveable). This code was developed using Python 3.10 and oTree 5.10.3. The tasks works very well on computers but may cause problems when running on tablets or mobile phones. 

Please cite as Laske, K., Römer, N. & Schröder, M (2023). Quality through Quantity? The Effects of Piece-Rate Incentives on Innovation. Mimeo.

© Nathalie Römer 2023
