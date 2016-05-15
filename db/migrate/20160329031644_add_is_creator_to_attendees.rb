class AddIsCreatorToAttendees < ActiveRecord::Migration
  def up
  	add_column :attendees, :is_creator, :boolean, :default => :false
  end

  def down
  	remove_column :attendees, :is_creator
  end
end
