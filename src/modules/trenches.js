export default class Trenches {
    scores = [];

    gameID = 'KCPk5IRfBdMsAoFLfft1';

    addNewScore = (score) => {
      this.scores.push(score);
    }

    clearArray = () => {
      this.scores = this.scores.splice(0, this.scores.length);
    }
}