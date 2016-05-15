class CreateEvents < ActiveRecord::Migration
  def up
    create_table :events do |t|
      t.string "name", :null => false
      t.decimal "lat", :precision => 10, :scale => 6
      t.decimal "lng", :precision => 10, :scale => 6
      t.datetime "start_time", :null => false
      t.datetime "end_time", :null => false
      t.column "gender", :gender
      t.json "age"
      t.json "top_conversations"
      t.string "place_id"

      t.timestamps null: false
    end
  end

  def down
  	drop_table :events
  end
end
