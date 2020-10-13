# One Line
### [Live Demo](https://adamnizol.github.io/oneline/)

One Line is a simple project I made which was inspired by the artist TFoust10 in which images are drawn and filled using a single line. In an attempt to get the same effect I used a recursive maze generation algorithm to fill the space with a maze that had no loops. I then traced around it to get a single line fill.

## Instructions

#### 1. Upload a black and white image that represents the region you want to fill
#### 2. Change the available settings to your liking
#### 3. Press the 'Refresh' button to generate a new output

## How it works

### Step 1: The input image is pixelated at the specified detai level
![Pixelate the image](notes/process1.png)

### Step 3: The pixelated region is transformed into a maze
![Make a make in the region](notes/process2.png)

### Step 3: The perimeter of the maze is traced until it reached the start
![Trace around the maze](notes/process3.png)

## Project Setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
``` 
