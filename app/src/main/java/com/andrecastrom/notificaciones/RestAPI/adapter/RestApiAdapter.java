package com.andrecastrom.notificaciones.RestAPI.adapter;

import com.andrecastrom.notificaciones.RestAPI.ConstantesRestAPI;
import com.andrecastrom.notificaciones.RestAPI.Endpoints;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by 47369176d on 18/11/2016.
 */

public class RestApiAdapter {

    public Endpoints establecerConexionRestAPI () {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(ConstantesRestAPI.ROOT_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        return retrofit.create(Endpoints.class);
    }

}
