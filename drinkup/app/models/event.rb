class Event < ActiveRecord::Base
	has_many :attendees
	validates :name, presence: true
	validates :lat, presence: true
	validates :lng, presence: true
	validates :gender, presence: true, inclusion: { in: %w(male female),
    		 				message: "%{value} is not a valid gender" }
    validates :datetime, presence: true
end
