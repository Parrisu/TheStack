package com.skilldistillery.stack.services;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skilldistillery.stack.entities.Function;
import com.skilldistillery.stack.entities.Node;
import com.skilldistillery.stack.entities.Technology;
import com.skilldistillery.stack.exceptions.EntityDoesNotExistException;
import com.skilldistillery.stack.repositories.FunctionRepository;
import com.skilldistillery.stack.repositories.NodeRepository;

@Service
public class FunctionServiceImpl implements FunctionService {

	@Autowired
	private FunctionRepository funRepo;

//	@Autowired
//	private AttendeeRepository attRepo;

	@Autowired
	NodeRepository nodeRepo;

	@Override
	public Set<Function> searchFunctions(String searchQuery, String cityName, String stateAbbr, String username,
			Set<Technology> stack) {
		searchQuery = (searchQuery != null && searchQuery.isBlank()) ? null : searchQuery;
		cityName = (cityName != null && cityName.isBlank()) ? null : cityName;
		stateAbbr = (stateAbbr != null && stateAbbr.isBlank()) ? null : stateAbbr;
		username = (username != null && username.isBlank()) ? null : username;
		stack = (stack != null && stack.isEmpty()) ? null : stack;
		return funRepo.searchFunctions(searchQuery, cityName, stateAbbr, username, stack);
	}

	@Override
	public Function findById(int id) {
		return funRepo.findById(id).get();

	}

	@Override
	public List<Function> findByNode(int id) {
		return funRepo.findByNodeId(id).stream().filter(Function::isEnabled).toList();
	}

	@Override
	public Function findByFunctionIdAndNodeId(int id, int fid) {
		return funRepo.findFunctionByIdAndNode(id, fid);
	}

	@Override
	public Function createFunction(int nodeId, Function function) {
		Node node = nodeRepo.findById(nodeId).get();
		function.setNode(node);
		return funRepo.saveAndFlush(function);
	}
	
	@Override
	public Function updateFunction(int nodeId, Function function) {
		Node node = nodeRepo.findById(nodeId).get();
		function.setNode(node);
		Function toUpdate = funRepo.findById(function.getId()).get();
		if (toUpdate != null) {
			toUpdate = funRepo.saveAndFlush(function);
			return toUpdate;
		}
		return toUpdate;

	}
	
	@Override
	public Function destroyFunction(int nodeId, int fId) {
		Function function = funRepo.findById(fId).get();
		function.setEnabled(!function.isEnabled());
		return funRepo.saveAndFlush(function);
		
	}

	@Override
	public Function setFunctionStatus(int functionId, boolean status) throws EntityDoesNotExistException{
		Function func = funRepo.findById(functionId).orElseThrow(EntityDoesNotExistException::new);
		func.setEnabled(status);
		return funRepo.saveAndFlush(func);
	}

//	@Override
//	public List<Attendee> findAttendeeByFunctionId(int id) {
//		return attRepo.findByFunction(id);
//	}

}
