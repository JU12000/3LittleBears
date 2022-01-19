# (^^) 3LittleBears

## About

3LittleBears is a free to use, open source project which can be found on the web
at [3LittleBears.dev](https://3LittleBears.dev). It connects to your Spotify
and recommends which playlist you should add your currently playing track to
based on the micro-genres Spotify returns with each track. In the future it may
also be able to make recommendations based on Spotify stats like dancability!

## How?

You can dig through the code if that's what you're asking. If you just want to
know how to use it here's the answer:

### Watch Currently Playing

It will show whatever your Spotify account is currently playing, there's a
manual refresh button but it also refreshes automatically with some frequency.
You'll notice some weird genres in curly braces (`{ }` <- these ones). These
genres come from Spotify, so we can use them to build really specific playlists.
Not ever song has had genres assigned, so sometimes we can't make a recommendation
though it is really cool to find one with no genres! If you click on one of the
genres it will take you to the research page for that genre at the incredible
site [Every Noise](https://everynoise.com) so you can find more artists that Spotify tagged with that genre.

### See Which Playlist The Bears Recommend

Under your Currently Playing section you'll see a list of Your Playlists. You
should recognize them because they'll all be yours. We filter out anything you
don't own (as in, weren't the original creator of). We also filter out anything
using the `IgnoreNotation`, but more on that later. You can see a match percentage
under each playlist. They're sorted by that match percentage, so the top left
playlist will always be the most recommended one. There's also an "Add to Playlist"
button which you can use, it won't show on any playlist that the song is already
a part of because accidentally creating duplicate songs on playlists feels really
bad.

## I Heard You Say Something About Notation?

Yes, to quote a young Anakin: "This is where the fun begins".

### Genre Notation

Let's say you're an aspiring young playlist creator, you like the organic
recommendations, but you've already got a playlist for all your
[German Dark Minimal Techno](https://everynoise.com/research.cgi?mode=genre&name=german+dark+minimal+techno).
You want that to show up before anything else because you know what you want better than we do. We know how you feel, so you can add `3LittleBears{}`
to any of your Spotify playlist descriptions and include any sub-genres you want
and we'll treat any match to those playlists as better than a match to one without.

For example: `This is my cool playlist description. 3LittleBears{math rock, instrumental math rock}`

Will always cause that playlist to get sorted first for any song that has one or
more of those two genres. If a song meets the genre critieria of two playlists
that both have genre annotations, whichever playlist has more annotated genres
in common with the song will have a higher recommendation %. Happy Notating!

### Ignore Notation

3LittleBears is a very specific kind of tool, it's not going to be useful to build
every type of playlist. In fact, it's only useful to build genre hyper-specific
playlists. If you have a playlist that gets build by different criteria - say,
only songs made between March and August of any given year, I don't know your life -
then you're going to want to remove it from the recommendation system. putting
`3LittleBearsIgnore` anywhere in the description of a playlist will stop it from
being loaded on the site, and we promise to never talk about it behind it's back.

### A Notation About Notations

If you're the kind of person with a lot of playlists you might find that the app takes an unbearable long time to load. You can speed this up significantly by using the notations described above. Simply add Ignore Notations and Genre Notations to as many playlists as you can and it will significantly reduce the amount of work the app has to do to get everything ready for you.

Anecdotally, during development I was able to reduce my load times from around 2 minutes, to just under 20 seconds by using a combination of notations, so this really can work wonders for you!

## So What Are You Doing With All My Data?

Absolutely nothing, we need some scopes from Spotify to get your data but everything
runs while you're on the site and we don't save anything. In the future we might
save the content of your playlists so that initial loading doesn't take so long.
Though if that happens there will be a nice red button at the bottom of the page
which allows you to delete all of your data. If we do save anything we will also
delete it if it hasn't been used in 30 days.

### There You Go

That's about it, bugs can be reported here, as can feature requests. Constructive
criticism is always welcome, everything else can be screamed into a jar and placed
on a shelf. I hope you enjoy using this as much as I do!
