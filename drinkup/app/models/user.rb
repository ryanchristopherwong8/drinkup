class User < ActiveRecord::Base

	has_many :attendees
end
