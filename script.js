const votesStorageKey = "finn-badelatschen-votes";
const userVoteStorageKey = "finn-badelatschen-user-vote";

const defaultVotes = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0
};

let votes = JSON.parse(localStorage.getItem(votesStorageKey)) || defaultVotes;
let userVote = localStorage.getItem(userVoteStorageKey);

const cards = document.querySelectorAll(".slipper-card");
const totalVotesElement = document.getElementById("totalVotes");
const leaderNameElement = document.getElementById("leaderName");
const winnerBox = document.getElementById("winnerBox");
const voteNote = document.getElementById("voteNote");
const resetButton = document.getElementById("resetButton");

function updatePage() {
  let totalVotes = 0;
  let highestVoteCount = 0;
  let leaderName = "";

  cards.forEach((card) => {
    const id = card.dataset.id;
    const name = card.dataset.name;
    const countElement = card.querySelector(".count");
    const voteButton = card.querySelector(".btn-vote");

    const currentVotes = votes[id] || 0;

    countElement.textContent = currentVotes;
    totalVotes += currentVotes;

    if (currentVotes > highestVoteCount) {
      highestVoteCount = currentVotes;
      leaderName = name;
    }

    if (userVote) {
      voteButton.disabled = true;

      if (userVote === id) {
        voteButton.textContent = "Deine Wahl ✓";
      } else {
        voteButton.textContent = "Abgestimmt";
      }
    } else {
      voteButton.disabled = false;
      voteButton.textContent = "Abstimmen";
    }
  });

  totalVotesElement.textContent = totalVotes;

  if (totalVotes > 0) {
    leaderNameElement.textContent = leaderName;

    winnerBox.innerHTML = `
      <span>🏆</span>
      <p>
        Aktuell führt <strong>${leaderName}</strong>
        mit <strong>${highestVoteCount}</strong>
        Stimme${highestVoteCount === 1 ? "" : "n"}.
      </p>
    `;
  } else {
    leaderNameElement.textContent = "–";

    winnerBox.innerHTML = `
      <span>🏆</span>
      <p>Noch keine Stimme vorhanden. Sei die erste Person, die entscheidet.</p>
    `;
  }

  if (userVote) {
    const selectedCard = document.querySelector(
      `.slipper-card[data-id="${userVote}"]`
    );

    const selectedName = selectedCard.dataset.name;

    voteNote.textContent = `Du hast bereits für „${selectedName}“ abgestimmt.`;
  } else {
    voteNote.textContent = "Pro Browser ist eine Stimme möglich.";
  }
}

cards.forEach((card) => {
  const voteButton = card.querySelector(".btn-vote");

  voteButton.addEventListener("click", () => {
    if (userVote) {
      return;
    }

    const id = card.dataset.id;

    votes[id] = (votes[id] || 0) + 1;
    userVote = id;

    localStorage.setItem(votesStorageKey, JSON.stringify(votes));
    localStorage.setItem(userVoteStorageKey, userVote);

    updatePage();
  });
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem(userVoteStorageKey);
  userVote = null;

  updatePage();
});

updatePage();