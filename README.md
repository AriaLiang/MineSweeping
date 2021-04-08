# MineSweeping
## Introduction
This is a simple minesweeping game, click here to experience: 
https://arialiang.github.io/MineSweeping/
### Basic Operation
1. Sweep the mine: click the grid
2. Mark the mine: right click the grid
3. Mark the uncertain position: right click the grid twice
4. Switch game level: click the menu button
## Design
Create an object for each game, the attributes include: 
1. Number of rows and columns
2. Number of mines and safety grids
3. Canvas element and 2d context
4. Grid size
5. An mineMatrix, where each element contains two attributes: bomb, state
6. A value used to mark whether it is the first click

### Functions
`ifNearbyBomb`
Traverse the 8 grids surrounding the current grid and calculate the number of mines. If it is not 0, mark number for the current grid; if it is 0, perform the same traversal operation for those 8 grids sequentially.

## Questions
`EventListner`
When using AddEventListener and RemoveEventListener, neither the anonymous function can be used, nor the context of the specified function can be changed (such as `bind(this)`).