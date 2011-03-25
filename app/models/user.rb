class User < ActiveRecord::Base
  
  def self.total_book_score
    (User.sum('book_count').to_f / User.sum('friend_count') * 100).to_i
  end
  
  def book_score
    ((self.book_count.to_f / self.friend_count).to_f * 100).to_i
  end
  
end
