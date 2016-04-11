class AddIsDeletedColumnToEvents < ActiveRecord::Migration
  def up
  	add_column :events, :is_deleted, :boolean, :default => false
  end

  def down
  	remove_column :events, :is_deleted
  end
end
