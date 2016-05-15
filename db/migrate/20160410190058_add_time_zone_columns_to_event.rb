class AddTimeZoneColumnsToEvent < ActiveRecord::Migration
  def up
  	add_column :events, :dstOffset, :string
  	add_column :events, :rawOffset, :string
  	add_column :events, :timeZoneId, :string
  	add_column :events, :timeZoneName, :string
    add_column :events, :utc_start_time, :datetime
    add_column :events, :utc_end_time, :datetime
  end

  def down
  	remove_column :events, :dstOffset
  	remove_column :events, :rawOffset
  	remove_column :events, :timeZoneId
  	remove_column :events, :timeZoneName
    remove_column :events, :utc_start_time
    remove_column :events, :utc_end_time
  end
end
