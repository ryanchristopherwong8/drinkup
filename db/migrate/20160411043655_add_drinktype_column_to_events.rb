class AddDrinktypeColumnToEvents < ActiveRecord::Migration
  def up
  	add_column :events, :drink_type, :string
  end

  def down
  	remove_column :events, :drink_type
  end
end
