class Api::WatchlistsController < ApplicationController

   def create
    @watchlist = Watchlist.new(watchlist_params)
    @user = @watchlist.user
    @user.account_balance = @user.account_balance - (params["lastPrice"].to_i * params["watchlist"][:num_stocks].to_i)

    if @user.account_balance < 0 
        errors = ["Not Enough Buying Power"]
        render json: errors, status: 422
    else

    @user.save!
    if @watchlist.save
        render "api/users/watchlist"
    else
         render json: @watchlist.errors.full_messages, status: 422
    end
    end
   end

   def update 
    @user = User.find_by_id(params['watchlist'][:user_id])
    result = @user.watchlists.where("stock_id = #{params['watchlist'][:stock_id]} AND user_id = #{params['watchlist'][:user_id]}")
    result[0].num_stocks = result[0].num_stocks + (params['watchlist'][:num_stocks]).to_i
    @user.account_balance = @user.account_balance - (params['lastPrice'].to_i * params['watchlist'][:num_stocks].to_i)

    if @user.account_balance < 0 
        errors = ["Not Enough Buying Power"]
        render json: errors, status: 422
    else

    @user.save!
    result[0].save!
    render "api/users/watchlist"
    end
   end

   def destroy 
    @user = User.find_by_id(params['watchlist'][:user_id])
    result = @user.watchlists.where("stock_id = #{params['watchlist'][:stock_id]} AND user_id = #{params['watchlist'][:user_id]}")
    result[0].num_stocks = result[0].num_stocks - (params['watchlist'][:num_stocks]).to_i

    if result[0].num_stocks < 0 
        errors = ["Not Enough Shares"]
        render json: errors, status: 422
    else

    @user.account_balance = @user.account_balance + ((params['watchlist'][:num_stocks]).to_i * (params['lastPrice']).to_i)
    @user.save!
    if result[0].num_stocks == 0
        result[0].destroy
        render json: {}
    else
    result[0].save!
    render "api/users/watchlist"
    end

    end

   end

   def show 
    @user = User.find(params[:id])
    render "api/users/watchlist"
   end


   private
   def watchlist_params 
        params.require(:watchlist).permit(:stock_id, :user_id, :num_stocks)
    end

end