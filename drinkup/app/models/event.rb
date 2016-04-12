class Event < ActiveRecord::Base

  acts_as_mappable :default_units => :kms,
                   	 :default_formula => :sphere,
                     :distance_field_name => :distance,
                     :lat_column_name => :lat,
                     :lng_column_name => :lng

	attr_accessor :location_name, :location_address, :count
	
	has_many :attendees
	has_many :users, through: :attendees
	has_one :chat

	validates :name, presence: true
	validates :lat, presence: true
	validates :lng, presence: true
	validates :start_time, presence: true
  validates :end_time, presence: true
  validates :place_id, presence: true
  validate :validate_timings

    #Source: http://stackoverflow.com/questions/20655633/validating-one-datetime-to-be-later-than-another  
    #Checks that start time is less than end time
    def validate_timings
        p start_time, end_time
        if (start_time > end_time)
            errors[:base] << "Start Time must be less than End Time"
        end
    end
  
    # Compares the conversations of all users for an event, by creating hash with the key being the conversation and value
    # being the number of times a conversation appears. We then return 3 most frequently occuring keys in descending order
    # Based off an implementation of counting sort.
    def getTopConversations
        eventConversations = []
        users = self.users.where("attendees.is_attending" => true)
        users.each do |user|
            userConversations = user.conversations.pluck(:name)
            (eventConversations << userConversations).flatten!  
        end

        conversationCounts = Hash.new 0
        eventConversations.each do |conversation|
            conversationCounts[conversation] += 1
        end

        topConversationsArr = conversationCounts.sort_by{ |k,v| v}.reverse[0..2]
        topConversations = Hash[topConversationsArr].keys
    end
end
