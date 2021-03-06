import { createSelector } from 'reselect';
import { last } from '../utils/array';
import { getEmptyFrame } from '../gameLogic/frame';

export const gameSelector = ({ game }) => game;

export const playersListSelector = createSelector(
  gameSelector,
  ({ playersList }) => playersList
);

export const playersSetSelector = createSelector(
  gameSelector,
  ({ playersSet }) => playersSet
);

export const playersGameSelector = createSelector(
  gameSelector,
  ({ playersGame }) => playersGame
);

export const currentPlayerIndexSelector = createSelector(
  gameSelector,
  ({ currentPlayerIndex }) => currentPlayerIndex
);

export const currentGameSelector = createSelector(
  playersGameSelector,
  currentPlayerIndexSelector,
  (playersGame, currentPlayerIndex) => playersGame[currentPlayerIndex]
);

const getLastFrameIfExists = ({ frames = [] } = {}) => {
  const lastFrame = last(frames);
  return !lastFrame ? getEmptyFrame() : lastFrame;
};

export const currentFrameSelector = createSelector(
  currentGameSelector,
  getLastFrameIfExists
);

export const previousGameSelector = createSelector(
  playersGameSelector,
  currentPlayerIndexSelector,
  (playersGame, currentPlayerIndex) =>
    playersGame[(currentPlayerIndex || playersGame.length) - 1]
);

export const previousFrameSelector = createSelector(
  previousGameSelector,
  getLastFrameIfExists
);

export const currentPlayerNameSelector = createSelector(
  currentPlayerIndexSelector,
  playersListSelector,
  (currentIndex, players) => players[currentIndex]
);

const scoreSelector = ({ frames }) => last(frames).score;

export const scoresSelector = createSelector(
  playersListSelector,
  playersGameSelector,
  (playersList, playersGame) =>
    playersList.map((name, i) => ({
      name,
      score: scoreSelector(playersGame[i]),
    }))
);

export const gameEndSelector = createSelector(gameSelector, ({ playersGame }) =>
  playersGame.reduce((bool, { end }) => bool && end, true)
);
