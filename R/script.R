data <- get_all_pkmn(1, 807)
desc <- get_all_descriptions(1, 807)

full_data <- inner_join(data, desc, by = "id")

save_json(full_data, "pkmn_dataset.json")