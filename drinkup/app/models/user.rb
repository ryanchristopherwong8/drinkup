class User < ActiveRecord::Base
    #declaring attributes that are not in database
    attr_accessor :remember_token

	#ensures email is downcased before saved
	before_save { self.email = email.downcase }

	has_many :attendees
  has_many :events, through: :attendees
  has_and_belongs_to_many :conversations

  #profile pictures
  has_attached_file :avatar, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  # Validate content type
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\Z/
  # Validate filename
  validates_attachment_file_name :avatar, matches: [/png\Z/, /jpe?g\Z/]

	#validate email
	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    validates :email, presence: true, length: { maximum: 255 }, 
    				format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }

    #hash password_digest using bcrypt
    has_secure_password

    #validate password
    validates :password, presence: true, length: { minimum: 6 }, :if => lambda{ new_record? || !password.nil? }

    # Returns the hash digest of the given string.
    def User.digest(string)
      cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
      BCrypt::Password.create(string, cost: cost)
    end

    # Returns a random token.
    def User.new_token
        SecureRandom.urlsafe_base64
    end

     #Remembers a user in the database for use in persistent sessions.
    def remember
      #generate a random token, self ensures that the user object is assigned the new token
      self.remember_token = User.new_token
      #hash the random token and store in database
      update_attribute(:remember_digest, User.digest(remember_token))
    end

    # Returns true if the given token matches the digest.
    def authenticated?(remember_token)
      #fixes bug = where logged in two browsers, log out of one, and still works on other
      return false if remember_digest.nil?
      BCrypt::Password.new(remember_digest).is_password?(remember_token)
    end

    # Forgets a user.
    def forget
      #reset encryped token
      update_attribute(:remember_digest, nil)
    end

    def getEventsAttending
      return self.events.where("attendees.is_attending"=>true)

    end
    
end
