class AddLocationNameAndAddressColumnsToEvents < ActiveRecord::Migration
  def up
  	add_column :events, :place_name, :string
  	add_column :events, :place_address, :string 

  end

  def down
  	remove_column :events, :place_name
  	remove_column :events, :place_address
  end
end
