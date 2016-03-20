class User < ActiveRecord::Base

	#ensures email is downcased before saved
	before_save { self.email = email.downcase }

	has_many :attendees

	#validate email
	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    validates :email, presence: true, length: { maximum: 255 }, 
    				format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }

    #hash password_digest using bcrypt
    has_secure_password

    #validate password
    validates :password_digest, presence: true, length: { minimum: 6 }
end
