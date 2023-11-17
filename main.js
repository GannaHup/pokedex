const LIMIT = 32

function toCapitalize(text) {
  if (!text) return ""
  return text
    .split(" ")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    )
    .join(" ")
}

function createCard(data) {
  const content = document.getElementById("content")
  // Create Card
  const cards = data.results.map(pokemon => {
    const parser = new DOMParser()
    const id = pokemon.url.split("/")[6]
    const templateCard = `
      <div class="card">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"
          alt=${pokemon.name}
          class="image-card"
        />
        <p class="pokemon-name">${toCapitalize(pokemon.name)}</p>
      </div>
    `
    const doc = parser.parseFromString(templateCard, 'text/html')
    return doc.querySelector(".card")
  })
  content.replaceChildren(...cards)
}

function handleShowHideButtonNavigation(data) {
  const buttonPrevious = document.querySelector('.btn-previous')
  const buttonNext = document.querySelector('.btn-next')

  // Handle Button Previous
  if (data.previous) {
    buttonPrevious.classList.remove("hide")
  } else {
    buttonPrevious.classList.add("hide")
  }

  // Handle Button Next
  if (data.next) {
    buttonNext.classList.remove("hide")
  } else {
    buttonNext.classList.add("hide")
  }
}

async function getAllPokemon(offset = 0) {
  return await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`)
    .then(res => res.json())
    .then(data => {
      createCard(data)
      handleShowHideButtonNavigation(data)
      return data
    })
    .catch(() => alert("ERROR BOS"))
    .finally(() => {
      const newURL = `${window.location.origin}?offset=${offset}`
      window.history.pushState({ path: newURL }, '', newURL)
    })
}

function handleButtonNavigation(key) {
  const currentOffset = Number(window.location.search.split("=").at(-1) || '0')
  let offsetValue = 0

  if (key === 'next') {
    offsetValue = currentOffset + LIMIT
  }

  if (key === 'previous') {
    offsetValue = currentOffset - LIMIT
  }

  getAllPokemon(offsetValue)
}

function renderApp() {
  const currentOffset = Number(window.location.search.split("=").at(-1) || '0')
  getAllPokemon(currentOffset)
}

renderApp()
