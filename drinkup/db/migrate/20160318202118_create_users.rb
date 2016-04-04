class CreateUsers < ActiveRecord::Migration
  def up
  	execute <<-SQL
  		CREATE TYPE gender AS ENUM ('any', 'male', 'female');
  	SQL
    create_table :users do |t|
      t.string "first_name", :null => false
      t.string "last_name", :null => false
      t.string "email", :null => false
      t.string "password", :null => false
      t.column "gender", :gender
      t.date "date_of_birth", :null => false
      t.string "location"
      t.json "conversations"
      #t.string "profile_pic_s3_id"
      t.boolean "is_deleted", :default => false

      t.timestamps null: false
    end
  end

  def down
  	drop_table :users

  	execute <<-SQL
  		DROP TYPE gender;
  	SQL
  end
end
