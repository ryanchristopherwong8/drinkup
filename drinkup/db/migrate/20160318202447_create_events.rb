class CreateEvents < ActiveRecord::Migration
  def up
    create_table :events do |t|
      t.string "name", :null => false
      t.decimal "lat", :precision => 10, :scale => 6
      t.decimal "lng", :precision => 10, :scale => 6
      t.datetime "datetime", :null => false
      t.column "gender", :gender
      t.json "age"
      t.json "top_conversations"
      #t.string "google_location_id"

      t.timestamps null: false
    end
  end

  def down
  	drop_table :events
  end
end
