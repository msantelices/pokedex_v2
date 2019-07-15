library(httr)
library(dplyr)
library(data.table)
library(jsonlite)

get_pkmn <- function(id) {
  
url <- paste("https://pokeapi.co/api/v2/pokemon/", id, sep = "")
res <- content(GET(url))

# Stats
stats <- list(
  speed           = unbox(res$stats[[1]]$base_stat),
  special_defense = unbox(res$stats[[2]]$base_stat),
  special_attack  = unbox(res$stats[[3]]$base_stat),
  defense         = unbox(res$stats[[4]]$base_stat),
  attack          = unbox(res$stats[[5]]$base_stat),
  hp              = unbox(res$stats[[6]]$base_stat)
)


# Types
types <- list( primary = FALSE, secondary = FALSE )
for(n in 1:length(res$types)) {
  
  if( res$types[[n]]$slot == 1 ) {
    types$primary <- unbox(res$types[[n]]$type$name)
  } else {
    types$secondary <- unbox(res$types[[n]]$type$name)
  }
}


# Abilities
abilities <- list( primary = FALSE, secondary = FALSE, hidden = FALSE )
for(n in 1:length(res$abilities)) {
  
  if( res$abilities[[n]]$slot == 1 ) {
    abilities$primary = unbox(res$abilities[[n]]$ability$name)
  }
  else if ( res$abilities[[n]]$slot == 2 ) {
    abilities$secondary = unbox(res$abilities[[n]]$ability$name)
  }
  else {
    abilities$hidden = unbox(res$abilities[[n]]$ability$name)
  }
  
}


# Sprite
sprite_base <- "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
sprite <- paste(sprite_base, id, ".png", sep = "")

data <- data.table(
  name      = res$species$name,
  id        = res$id,
  sprite    = sprite,
  weight    = res$weight / 10,
  height    = res$height / 10,
  stats     = list(stats),
  types     = list(types),
  abilities = list(abilities)
)

data

}

get_description <- function(id) {
  url <- paste("https://pokeapi.co/api/v2/pokemon-species/", id, sep = "")
  res <- content(GET(url))
  
  desc <- NULL
  for(n in 1:length(res$flavor_text_entries)) {
    if( res$flavor_text_entries[[n]]$language$name == "en" ) {
      desc <- res$flavor_text_entries[[n]]$flavor_text
      break
    }
  }
  
  desc <- gsub('\n', ' ', desc)
  
  data <- data.frame( id = id, description = desc)
  data
  
}


get_all_pkmn <- function(start, end) {
  result <- NULL
  for(n in start:end) {
    row <- get_pkmn(n)
    result <- bind_rows(result, row)
    print(n)
  }
  result
}

get_all_descriptions <- function(start, end) {
  result <- NULL
  for(n in start:end) {
    row <- get_description(n)
    result <- bind_rows(result, row)
    print(n)
  }
  result
}


save_json <- function(input, filename) {
  file <- file(filename, encoding = "UTF-8")
  write( toJSON(input, auto_unbox = TRUE), file = file )
}


