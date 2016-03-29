class Event < ActiveRecord::Base

	has_many :attendees
	has_many :users, through: :attendees
	
	validates :name, presence: true
	validates :lat, presence: true
	validates :lng, presence: true
	validates :start_time, presence: true
    validates :end_time, presence: true
	validates :gender, presence: true, inclusion: { in: %w(any male female),
    		 				message: "%{value} is not a valid gender" }
end
