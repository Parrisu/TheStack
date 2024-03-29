package com.skilldistillery.stack.services;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skilldistillery.stack.entities.Address;
import com.skilldistillery.stack.entities.Node;
import com.skilldistillery.stack.entities.Technology;
import com.skilldistillery.stack.entities.User;
import com.skilldistillery.stack.exceptions.EntityDoesNotExistException;
import com.skilldistillery.stack.exceptions.InvalidEntityException;
import com.skilldistillery.stack.repositories.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	UserRepository userRepo;

	@Autowired
	private AddressService addressService;

	@Override
	public Address updateUserAddress(int userId, Address address)
			throws EntityDoesNotExistException, InvalidEntityException {
		User user = userRepo.findById(userId).orElse(null);
		if (user == null) {
			throw new EntityDoesNotExistException("User does not exist for id " + userId + ".");
		}
		address = addressService.createAddress(address);
		user.setAddress(address);
		userRepo.saveAndFlush(user);
		return address;
	}

	@Override
	public Address getUserAddress(int userId) throws EntityDoesNotExistException {
		User user = userRepo.findById(userId).orElse(null);
		if (user == null) {
			throw new EntityDoesNotExistException("User does not exist.");
		}
		return user.getAddress();

	}

	@Override
	public User Update(User user) {
		User update = userRepo.findByUsername(user.getUsername());
		update.setAboutMe(user.getAboutMe());
		update.setFirstName(user.getFirstName());
		update.setLastName(user.getLastName());
		update.setProfileImageUrl(user.getProfileImageUrl());
		return userRepo.saveAndFlush(update);
	}

	@Override
	public User updateUserTech(int id, Technology tech) {
		User updateUser = userRepo.findById(id).get();
		if (updateUser != null) {
			List<Technology> stack = updateUser.getStack();
			if (stack.contains(tech)) {
				stack.remove(tech);
			} else {
				stack.add(tech);
			}
			updateUser.setStack(stack);
			userRepo.saveAndFlush(updateUser);
		}
		return updateUser;
	}

	@Override
	public User getUserByUsername(String username) {
		return userRepo.findByUsername(username);
	}

	@Override
	public boolean Destroy(int id) {
		User user = userRepo.findById(id).get();
		if (user.isEnabled() == true) {
			user.setEnabled(false);
			userRepo.saveAndFlush(user);
			return true;
		}
		return false;

	}

	@Override
	public boolean ReActivate(int id) {
		User user = userRepo.findById(id).get();
		if (user.isEnabled() == false) {
			user.setEnabled(true);
			userRepo.saveAndFlush(user);
			return true;
		}
		return false;

	}

	@Override
	public Set<User> getAll(String searchQuery) {
		return new HashSet<>(userRepo.getAll(searchQuery).stream().filter(User::isEnabled).toList());
	}

	@Override
	public User setUserStatus(int userId, boolean status) throws EntityDoesNotExistException {
		User user = userRepo.findById(userId).orElseThrow(EntityDoesNotExistException::new);
		user.setEnabled(status);
		return userRepo.saveAndFlush(user);
	}

	@Override
	public User getUserById(int id) {
		return userRepo.findById(id).get();
	}
	
}
