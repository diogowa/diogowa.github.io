# Cats & Dogs Talking

Social media platforms are a major source of information and entertainment for many people, covering everything from news and entertainment to updates from family and friends.

For our **Digital Entertainment** course at NOVA FCT, we explored the concept of echo chambers created by social networks and amplified by their algorithms.

This project simulates a simplified social media feed to demonstrate how personalisation algorithms can gradually isolate users wihtin content bubbles.


## The Project

We created a mock social network called Cats & Dogs Talking, where every post is about either a cat 🐱 or a dog 🐶.

The feed is displayed as a grid, with each cell containing a post:
- **Blue cells**: cat posts.
- **Red cells**: dog posts.

Initially, the grid is split evenly (50% cats / 50% dogs).

The user interacts with posts by clicking to "like" them, clicking again removes the "like". The algorithm uses your likes to adjust the distribution of future posts, reflecting your growing preferences. Over time, this may lead to an echo chamber, where your feed contains only one type of content.


## How It Works

The grid represents your news feed, but is arranged from left ot right instead of from top to bottom. Each "like" updates the probability that the algorithm will show you cat or dog posts. Future posts on the feed are generated based on this probability.


## Observations to Try

- Maintain a balance in likes to keep a 50/50 distribution.
- Like only cats or only dogs and watch your feed gradually become one-sided.
- Try to escape an echo chamber once it has formed — you'll see that it's harder than it seems.


## Important

For accurate results:
- Click on posts in the reading order of a social media feed.
- Avoid random clicking to get a realistic simulation.


## Conclusion

This project demonstrates how algorithms can create and reinforce echo chambers by filtering content to match a user’s preferences.

While this personalisation can enhance the user experience, it also carries the risk of narrowing perspectives, limiting exposure to opposing ideas, and potentially even fostering radicalisation.

It is therefore important to reflect how to avoid echo chambers and strive for a broader, more diverse view of the world.


## Tech Stack

The website is mobile responsive and uses only raw HTML / CSS and JavaScript.

- **HTML / CSS**: layout, UI, and animations.
- **JavaScript**: logic and social network algorithm.


## Author

- Diogo Matias (@diogowa), nº70019, LEI: Research and Project (Web-application).
- Guilherme Santos, nº65718, LMAGR: Research, Report and Presentation.
- Inês Martins, nº66477, LMAGR: Research, Report and Presentation.
- Lara Almeida, nº 65439, LMAGR: Research and Report.
- Nuno Duarte, nº60593, MIEI: Research and Report.
