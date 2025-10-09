# Catan - Practice impementation

## Pre-requirements

- [Go ^1.25](https://go.dev/dl/) - Backend service
- [Wails ^2](https://wails.io/) - Framework for app bundling
- [Bun ^1.1](https://bun.sh/) - Frontend bundler
- [Buf Build](https://buf.build/docs/cli/quickstart/) - Protobuf compiler

## Game rules

This is a base Catan game with maximum of 4 players.

Game tiles:

- 3 Mine - resource Clay
- 4 Forest - resource Wood
- 4 Pasture - resource Sheep
- 4 Field - resource Wheat
- 3 Mountain - resource Ore
- 1 Desert - no resource

Game resource cards in bank at the start of the game:

- 19 - Clay
- 19 - Wood
- 19 - Sheep
- 19 - Wheat
- 19 - Ore

Game progression cards:

- 2 - Monopoly - Request a resource card, each player must give 3 cards of
  that resource type. If a player does not have 3 cards, they must give
  all the cards of that resource type.
- 2 - Road Building - Build 2 roads.
- 2 - Invention - Get 2 resource cards from the bank. Can be the same or
  different resource cards.
- 14 - Knight - When played, move Thief to a new tile, in addition,
  get 1 resource card from from a player that has a settlement connected
  to that tile node.
- 5 - Points - Gain 1 point when activated.

Achievement cards:

- 1 - Longest Road - Gives 2 points - first player to connect 5 roads will
  get this achievement. If any other player connects more roads then
  a player holding this achievement, they will take over the achievement.
- 1 - Largest Army - Gives 2 points - first player to have a total of 3
  Knights active will get this achievement. If any other player has
  more Knights then a player holding this achievement, they will take
  over the achievement.

Thief:

- Tile on which Thief is placed will not produce resources.

How to win:

- First player to get 10 points is a winner.

Game setup:

1. Tiles are shuffled and are placed from top left corner (2,0) clockwise.
2. Number values are assigned to each tile starting from top left (2,0).
3. Thief is placed on the Desert tile.
4. Each player should have in there possession:
    - 5 Villages
    - 4 Cities
    - 15 Roads
5. Each player will roll the dice and player that rolls the highest number
   will play first. If more then one player rolls the same number, dice is rolled
   again.
6. First player will place 1 Village and 1 Rode on the board where
   Road must be connected to placed Village. After that, in
   clockwise direction, each player will place a City and a Road on the board.
   When last player places a City and a Rode, they will receive resources
   from Tiles that Village is connected to. After that, last player that placed
   a Village, will place another Village and Road where Road must be connected
   to that Village. In counterclockwise direction,
   each player will place another Village and a Road on the board.
7. Game starts with a player that rolled the highest number.

Game loop:

1. Active player rolls dices.
    - If 7 is rolled
        - Players that have 7 or more resource cards must return half of
          card to the bank, this includes the active player:
            - 7 cards in hand -> give any 3 resource cards to the bank,
            - 8 cards in hand -> give any 4 resource cards to the bank,
            - 9 cards in hand -> give any 4 resource cards to the bank,
            - 10 cards in hand -> give any 5 resource cards to the bank, etc.
        - Active player must move the Thief to a new tile and take
          1 resource card from a player that has a settlement connected to that tile
          where Thief is placed.
    - If any other number is rolled, Tiles with corresponding number will
      produce resources to players that have settlements connected to that Tile.
      Villages will produce 1 resource card, Cities will produce 2 resources.
2. Active player can trade with other players or with a bank.
   Only resource cards can be traded.
   Also, other players can offer trade to active player. Trade can be done only
   between active player and non-active player. Non-active player cannot trade
   between themselves.
3. Active player can expend. Build Roads, Villages, Cities, buy progression
   cards or play progression cards.
    - In a single turn active player can build maximum of 2 Roads,
      1 progression card of each type and any number of Villages or Cities.
4. Moving clockwise, next player becomes the active player and loop starts again.

## For Developers

There are some important abstract things about the game that will be
covered in this section. This is not required to play the game, but it will
help you understand the game mechanics.

### Tiles

Tiles, Nodes and Edges are important because players and place settlements
and Roads on them, where Tiles are giving resources to players based on
type of settlement they have on a specific Node for a specific Tile.

Event though we are working with hexagons, Tile coordinates are based on the
square grid. Something like this:

```txt
    0 2 4 6 8
  |___________
0 |   □ □ □
1 |  □ □ □ □
2 | □ □ □ □ □
3 |  □ □ □ □
4 |   □ □ □
```

_Graph 1 - Hexagon grid with squares_

Since hexagons are not squares we can approximate that moving by 1 hexagon
in X direction will increase by 2 and moving by Y direction will increase by 1.
Reason behind this is because in the Y axis, hexagons are overlapping, while
in the X axis, hexagons are not overlapping.

This means that far left hexagon will have $x=0$ while top left hexagon will
have $y=0$. In this way we can generalize coordinates to any hexagon grid of
any size as long as hexagons are oriented in the same way.

As far as this games goes, we will need to craft grid manually because there
is no need to generalize grid coordinates generation for any grid size.

### Nodes

Node positions can be generated automatically relative to Tile position. If
we take a look at each Tile on the grid, relative node position can be
defined like this:

```txt
--- T(x,y) ---

      1,0
      /\
     /  \
0,1 /    \ 2,1
    | T  |
    |    |
0,2 \    / 2,2
     \  /
      \/
      1,3
```

_Graph 2 - Nodes relative to Tiles_

If we do this, absolute Node position can be calculated like this:

$$
\begin{align}
N_x = T_x + n_x \\
N_y = T_y\times2 + n_y
\end{align}
$$

_Eq 1 - Relative to absolute node position_

where:

- $T_x$ - Tile X position
- $T_y$ - Tile Y position
- $n_x$ - Relative Node X position
- $n_y$ - Relative Node Y position
- $N_x$ - Absolute Node X position
- $N_y$ - Absolute Node Y position

This can be proven on $2\times2$ grid:

```txt
            2,0
            /\
           /  \
      1,1 /    \ 3,1
          | 1,0|
      1,2 |    | 3,2
       /\ \    / /\
      /  \ \  / /  \
 0,3 /    \ \/ /    \ 4,3
     | 0,1|    | 2,1|
     |    |    |    |
 0,4 \    / /\ \    / 4,4
      \  / /  \ \  /
       \/ /    \ \/
      1,5 | 1,2| 3,5
          |    |
      1,6 \    / 3,6
           \  /
            \/
            2,7
```

_Graph 3 - Absolute Node positions in $2\times2$ grid_

Inner Nodes of the grid above are not shown but you can verify them youself
by using _Graph 2_ and _Eq 1_.

### Edges

For Edges, we can do the same thing as with Nodes, we just need to offset
X and Y coordinates like this:

```txt
--- T(x,y) ---

      /\
 1,0 /  \ 2,0
    /    \
0,1 | T  | 3,1
    |    |
    \    /
 1,2 \  / 2,2
      \/
```

_Graph 4 - Edges relative to Tiles_

To get Edges absolute position you will use:

$$
\begin{align}
E_x = T_x + e_x \\
E_y = T_y\times2 + e_y
\end{align}
$$

_Eq 2 - Relative to absolute node position_

where:

- $T_x$ - Tile X position
- $T_y$ - Tile Y position
- $e_x$ - Relative Edge X position
- $e_y$ - Relative Edge Y position
- $E_x$ - Absolute Edge X position
- $E_y$ - Absolute Edge Y position

We will not repeat _Graph 3_, but by using _Eq 2_ and _Graph 4_, you should be
able to verify that absolute Edges calculation is correct and will produce
the same result as _Graph 3_.

---

## About

This is the official Wails Vue-TS template.

You can configure the project by editing `wails.json`. More information about the project settings can be found
here: https://wails.io/docs/reference/project-config

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.
