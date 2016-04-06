class CreateChats < ActiveRecord::Migration
  def change
    create_table :chats do |t|
      t.integer :event_id

      t.timestamps null: false
    end
  end
end
