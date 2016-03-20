Rails.application.routes.draw do

  get 'signup'  => 'users#new'

  root 'sessions#index'

  match ':controller(/:action(/:id))', :via => [:get, :post]

  
end
