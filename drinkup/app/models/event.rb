class Event < ActiveRecord::Base
	has_many :attendees
	attr_accessor :location_name, :location_address
	validates :name, presence: true
	validates :lat, presence: true
	validates :lng, presence: true
	validates :gender, presence: true, inclusion: { in: %w(any male female),
    		 				message: "%{value} is not a valid gender" }
    validates :start_time, presence: true
    validates :end_time, presence: true
    validates :place_id, presence: true
end
