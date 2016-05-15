class CreateAttendees < ActiveRecord::Migration
  def up
    create_table :attendees do |t|
      t.references :user
      t.references :event
      t.boolean "is_attending", :default => false

      t.timestamps null: false
    end
  end

  def down 
  	drop_table :attendees
  end 
end
