class User < ActiveRecord::Base
  
  def self.total_book_score
    User.sum('book_count') / User.sum('friend_count')
  end
  
  def book_score
    self.book_count / self.friend_count
  end
  
end
