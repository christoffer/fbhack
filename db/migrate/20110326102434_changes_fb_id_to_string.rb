class ChangesFbIdToString < ActiveRecord::Migration
  def self.up
    change_column(:users, :fb_id, :string)
  end

  def self.down
  end
end
