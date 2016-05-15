class CreateConversations < ActiveRecord::Migration
  def up
    create_table :conversations do |t|
      t.string "name"

      t.timestamps null: false
    end
  end

  def down
  	drop_table :conversations
  end
end
