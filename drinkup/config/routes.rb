Rails.application.routes.draw do

  #routes for chat and messages
  resources :chat, only: [ :create, :show] do
    resources :messages, only: [ :create]
  end

  resources :users do
    collection do
      get 'getConversations'
    end
    member do 
      get 'settings'
      patch 'saveSettings'
      post 'saveConversations'
      delete 'removeConversations'
    end
  end
  
  get 'signup'  => 'users#new'
  get    'login'   => 'sessions#new'
  post   'login'   => 'sessions#create'
  delete 'logout'  => 'sessions#destroy'

  root 'sessions#index'
  resources :events do
  	collection do
  		get 'getEvents'
  	end
    member do 
        get 'getTopConversations'
    end
  end
  match ':controller(/:action(/:id))', :via => [:get, :post]
  
end
