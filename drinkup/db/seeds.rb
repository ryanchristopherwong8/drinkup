# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

conversations = Conversation.create([{name: 'Hockey'}, {name: 'Soccer'}, {name: 'Sports'}, {name: 'Movies'}, 
	{name: 'Video Games'}, {name: 'Cooking'}, {name: 'Politics'}, {name: 'History'}, {name: 'Tech'},  ])
