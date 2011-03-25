class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.integer :fb_id
      t.integer :book_count, :default => 0
      t.integer :friend_count, :default => 0
      t.timestamps
    end
  end

  def self.down
    drop_table :users
  end
end
