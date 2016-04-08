class Event < ActiveRecord::Base

  	acts_as_mappable :default_units => :kms,
                   	 :default_formula => :sphere,
                     :distance_field_name => :distance,
                     :lat_column_name => :lat,
                     :lng_column_name => :lng
	
	has_many :attendees
	has_many :users, through: :attendees
	has_one :chat

	validates :name, presence: true
	validates :lat, presence: true
	validates :lng, presence: true
	validates :start_time, presence: true
    validates :end_time, presence: true
	# validates :gender, presence: true, inclusion: { in: %w(any male female),
 #    		 				message: "%{value} is not a valid gender" }
    validates :place_id, presence: true

    def getTopConversations
        eventConversations = []
        attendees = self.attendees.where(:is_attending => true)
        attendees.each do |attendee|
            user = attendee.user
            userConversations = user.conversations.pluck(:name)
            (eventConversations << userConversations).flatten!
    	end

        conversationCounts = Hash.new 0
        eventConversations.each do |conversation|
            conversationCounts[conversation] += 1
        end

        topConversations = conversationCounts.sort_by{ |k,v| v}.reverse[0..2].to_h.keys
    end
end
