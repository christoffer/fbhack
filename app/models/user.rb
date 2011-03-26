class User < ActiveRecord::Base
  
  def self.total_book_score
    return 0 if User.count == 0
    (User.sum('book_count').to_f / User.sum('friend_count') * 10).to_i
  end
  
  def book_score
    ((self.book_count.to_f / self.friend_count).to_f * 10).to_i
  end
  
end
